# Substrate runtime upgrade bug report

This repo is forked from substrate-node-template. It adds simple storage upgrade
to pallet-template.

The file `runtime_upgrade_examples/lib.rs` adds simple `on_runtime_upgrade`
hook to pallet template. The file `runtime_upgrade_examples/runtime-lib.rs`
bumps spec version.

Script `./runtime_upgrade_examples/test.sh` compiles both base and modified
versions, starts blockchain and performs runtime upgrade

Steps to reproduce:

- Fork this repo
- Install rust
- Run script `./runtime_upgrade_examples/test.sh`

Expected: value of `something` after upgrade becomes `32`

Actual: value of `something` after upgrade remains `None`

The output of the script is

```
```
