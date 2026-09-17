// Destination-address shapes for the three payment rails.
//
// The USDT rail moved from TRON (TRC-20, `T…`) to Ethereum (ERC-20, `0x` + 40
// hex). A stored value of the old shape is not a destination for the rail the
// storefront now advertises, and neither is a placeholder such as
// `TPLACEHOLDER_REPLACE_ME` or `0xPLACEHOLDER_REPLACE_ME`. Both the GraphQL
// resolver and the admin card read through these predicates, so a value that is
// not an address of its own rail's shape resolves to "unconfigured" instead of
// being printed, copied or paid.
//
// These are shape checks, not on-chain validation: payment is confirmed by hand.
// Bitcoin-shaped strings: bech32/bech32m (`bc1…`, which is lower case — the
// charset excludes the separator's own `1`, and `b`/`i`/`o`; mixed case is not a
// bech32 string) or legacy base58 (`1…`/`3…`).
const BITCOIN = /^(?:bc1[02-9ac-hj-np-z]{8,87}|[13][1-9A-HJ-NP-Za-km-z]{25,39})$/;
// `0x` followed by exactly 40 hex digits. Shape only: this says nothing about
// who owns the address, which network it is usable on, or whether its case
// matches an EIP-55 checksum — mixed case is accepted as typed.
const ERC20 = /^0x[0-9a-f]{40}$/i;
export function isBitcoinAddress(value) {
    return typeof value === 'string' && BITCOIN.test(value.trim());
}
export function isErc20Address(value) {
    return typeof value === 'string' && ERC20.test(value.trim());
}
