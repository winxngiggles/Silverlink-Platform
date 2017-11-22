import contract from 'truffle-contract';
import LNKSTokenArtifact from '../contracts/LNKSToken.json';
import LNKSExchangeArtifact from '../contracts/LNKSExchange.json';


export function initWeb3(payload) {
	let web3 = window.web3,
		Web3 = window.Web3,
		provider;

	if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
		provider = web3.currentProvider;
		let web3Initiated = new Web3(provider);

		return {
			type: 'INIT_WEB3',
			payload: {
				web3Initiated: web3Initiated,
				web3: web3,
				provider: provider,
			}
		}
	}

	return {
		type: 'INIT_WEB3',
		payload: {
			web3Initiated: null,
			web3: null,
			provider: null
		}
	}
}

export function initLNKSTokenContract(payload) {
	let instance = contract(LNKSTokenArtifact);
	instance.setProvider(payload.provider);

	return {
		type: 'INIT_LNKS_TOKEN',
		payload: instance
	}
}

export function initLNKSExchangeContract(payload) {
	let instance = contract(LNKSExchangeArtifact);
	instance.setProvider(payload.provider);

	return {
		type: 'INIT_LNKS_EXCHANGE',
		payload: instance
	}
}

export function fetchAccount(payload) {
	return (dispatch, getState) => {
		if (payload.web3) {
			payload.web3.eth.getCoinbase((err, account) => {
				if (err === null) {
					dispatch({
						type: 'FETCH_ACCOUNT',
						payload: account
					});
				} else {
					dispatch({
						type: 'FETCH_ACCOUNT',
						payload: null
					});
				}
			});
		} else {
			dispatch({
				type: 'FETCH_ACCOUNT',
				payload: null
			});
		}
	}
}