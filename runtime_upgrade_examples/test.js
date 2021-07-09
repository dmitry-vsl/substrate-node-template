const assert = require('assert')
const fs = require('fs')
const {ApiPromise, WsProvider, Keyring} = require('@polkadot/api');

const codePath = process.argv[2]

async function sendTxAndWait(api, account, tx){
  return new Promise(async (resolve, reject) => {
    const unsub = await tx.signAndSend(account, (result) => {
      if (result.status.isInBlock) {
        let rejected = false
        result.events
        .filter(({event}) =>
          api.events.system.ExtrinsicFailed.is(event)
        )
        .forEach(({ event: { data: [error, info] } }) => {
          if (error.isModule) {
            const decoded = api.registry.findMetaError(error.asModule);
            const { documentation, method, section } = decoded;
            reject(`${section}.${method}`)
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            reject(error)
          }
          rejected = true
        })
        unsub();
        if(!rejected){
          resolve(result)
        }
      }
    })
  })
}

async function withAPI(action){
  const wsProvider = new WsProvider()
  const api = await ApiPromise.create({ 
    provider: wsProvider,
  })
  try {
    await action(api)
  } finally {
    await api.disconnect()
  }
}

async function main(){

  await require('@polkadot/wasm-crypto').waitReady()
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice')

  await withAPI(async api => {

    async function setCode(){
      const code = fs.readFileSync(codePath).toString('hex');
      const tx = api.tx.system.setCode(`0x${code}`)
      console.log(`Upgrading runtime, ${code.length / 2} bytes`);
      return await sendTxAndWait(api, alice, api.tx.sudo.sudoUncheckedWeight(tx, 0))
    }

    let something
    
    something = await api.query.templateModule.something()
    console.log('something is', something.isSome && something.unwrap())

    console.log('upgrading runtime')
    await setCode()
    console.log('runtime upgraded')

    something = await api.query.templateModule.something()
    console.log('something is', something.isSome && something.unwrap())

  })
}

main().catch(e => console.log(e))
