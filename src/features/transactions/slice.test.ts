import { createStore, Store } from '@reduxjs/toolkit'
import { ChainId } from 'src/constants/chains'
import {
  addTransaction,
  checkTransaction,
  finalizeTransaction,
  initialState,
  resetTransactions,
  transactionReducer,
  TransactionState,
} from 'src/features/transactions/slice'
import { TransactionStatus, TransactionType } from 'src/features/transactions/types'

describe('transaction reducer', () => {
  let store: Store<TransactionState>

  beforeEach(() => {
    store = createStore(transactionReducer, initialState)
  })

  describe('addTransaction', () => {
    it('adds the transaction', () => {
      const beforeTime = new Date().getTime()
      store.dispatch(
        addTransaction({
          chainId: ChainId.MAINNET,
          hash: '0x0',
          from: 'abc',
          info: {
            type: TransactionType.APPROVE,
            tokenAddress: 'abc',
            spender: 'def',
          },
        })
      )
      const txs = store.getState().byChainId
      expect(txs[ChainId.MAINNET]).toBeTruthy()
      expect(txs[ChainId.MAINNET]?.['0x0']).toBeTruthy()
      const tx = txs[ChainId.MAINNET]?.['0x0']
      expect(tx).toBeTruthy()
      expect(tx?.hash).toEqual('0x0')
      expect(tx?.from).toEqual('abc')
      expect(tx?.addedTime).toBeGreaterThanOrEqual(beforeTime)
      expect(tx?.info).toEqual({
        type: TransactionType.APPROVE,
        tokenAddress: 'abc',
        spender: 'def',
      })
    })
  })

  describe('finalizeTransaction', () => {
    it('no op if not valid transaction', () => {
      store.dispatch(
        finalizeTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x0',
          receipt: {
            status: TransactionStatus.Success,
            transactionIndex: 1,
            transactionHash: '0x0',
            to: '0x0',
            from: '0x0',
            contractAddress: '0x0',
            blockHash: '0x0',
            blockNumber: 1,
          },
        })
      )
      expect(store.getState().byChainId).toEqual({})
    })
    it('sets receipt', () => {
      store.dispatch(
        addTransaction({
          hash: '0x0',
          chainId: ChainId.RINKEBY,
          info: { type: TransactionType.APPROVE, spender: '0x0', tokenAddress: '0x0' },
          from: '0x0',
        })
      )
      const beforeTime = new Date().getTime()
      store.dispatch(
        finalizeTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x0',
          receipt: {
            status: TransactionStatus.Success,
            transactionIndex: 1,
            transactionHash: '0x0',
            to: '0x0',
            from: '0x0',
            contractAddress: '0x0',
            blockHash: '0x0',
            blockNumber: 1,
          },
        })
      )
      const tx = store.getState().byChainId[4]?.['0x0']
      expect(tx?.confirmedTime).toBeGreaterThanOrEqual(beforeTime)
      expect(tx?.receipt).toEqual({
        status: TransactionStatus.Success,
        transactionIndex: 1,
        transactionHash: '0x0',
        to: '0x0',
        from: '0x0',
        contractAddress: '0x0',
        blockHash: '0x0',
        blockNumber: 1,
      })
    })
  })

  describe('checkTransaction', () => {
    it('no op if not valid transaction', () => {
      store.dispatch(
        checkTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x0',
          blockNumber: 1,
        })
      )
      expect(store.getState().byChainId).toEqual({})
    })
    it('sets lastCheckedBlockNumber', () => {
      store.dispatch(
        addTransaction({
          hash: '0x0',
          chainId: ChainId.RINKEBY,
          info: { type: TransactionType.APPROVE, spender: '0x0', tokenAddress: '0x0' },
          from: '0x0',
        })
      )
      store.dispatch(
        checkTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x0',
          blockNumber: 1,
        })
      )
      const tx = store.getState().byChainId[4]?.['0x0']
      expect(tx?.lastCheckedBlockNumber).toEqual(1)
    })
    it('never decreases', () => {
      store.dispatch(
        addTransaction({
          hash: '0x0',
          chainId: ChainId.RINKEBY,
          info: { type: TransactionType.APPROVE, spender: '0x0', tokenAddress: '0x0' },
          from: '0x0',
        })
      )
      store.dispatch(
        checkTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x0',
          blockNumber: 3,
        })
      )
      store.dispatch(
        checkTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x0',
          blockNumber: 1,
        })
      )
      const tx = store.getState().byChainId[ChainId.RINKEBY]?.['0x0']
      expect(tx?.lastCheckedBlockNumber).toEqual(3)
    })
  })

  describe('clearAllTransactions', () => {
    it('removes all transactions for the chain', () => {
      store.dispatch(
        addTransaction({
          chainId: ChainId.MAINNET,
          hash: '0x0',
          info: { type: TransactionType.APPROVE, spender: 'abc', tokenAddress: 'def' },
          from: 'abc',
        })
      )
      store.dispatch(
        addTransaction({
          chainId: ChainId.RINKEBY,
          hash: '0x1',
          info: { type: TransactionType.APPROVE, spender: 'abc', tokenAddress: 'def' },
          from: 'abc',
        })
      )
      const txs = store.getState().byChainId
      expect(Object.keys(txs)).toHaveLength(2)
      expect(Object.keys(txs)).toEqual([String(1), String(4)])
      expect(Object.keys(txs[1] ?? {})).toEqual(['0x0'])
      expect(Object.keys(txs[4] ?? {})).toEqual(['0x1'])
      store.dispatch(resetTransactions())
      expect(Object.keys(store.getState().byChainId)).toHaveLength(0)
    })
  })
})
