# Substrate runtime upgrade bug report

This repo is forked from substrate-node-template. It adds simple storage upgrade
to pallet-template.

The file [runtime_upgrade_examples/lib.rs](runtime_upgrade_examples/lib.rs) adds simple `on_runtime_upgrade`
hook to pallet template. The file `runtime_upgrade_examples/runtime-lib.rs`
bumps spec version.

Script [./runtime_upgrade_examples/test.sh](./runtime_upgrade_examples/test.sh) compiles both base and modified
versions, starts blockchain and performs runtime upgrade

Steps to reproduce:

- Clone this repo
- Install rust
- Run script `./runtime_upgrade_examples/test.sh`

Expected: value of `something` after upgrade becomes `32`

The output of the script should be like this:

```
...
...
something is false
upgrading runtime
Upgrading runtime, 300464 bytes
2021-07-10 00:16:48        API/INIT: Runtime version updated to spec=101, tx=1
runtime upgraded
something is u32 {
  negative: 0,
  words: [ 32 ],
  length: 1,
  red: null,
  registry: TypeRegistry { createdAtHash: undefined },
  createdAtHash: undefined
}
```

Actual: value of `something` after upgrade remains `None`

The output of the script is

```
...
...
something is false
upgrading runtime
Upgrading runtime, 300860 bytes
2021-07-09 23:58:25        API/INIT: Runtime version updated to spec=101, tx=1
runtime upgraded
something is false
```
