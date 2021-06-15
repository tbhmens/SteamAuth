/** @module SteamAuth */
const openid = require('openid');
const identifier = 'https://steamcommunity.com/openid';


class AuthenticationError extends Error {
	/**
	 * 
	 * @param {string} message - Error Message
	 */
	constructor(message) {
		super(message);
		this.name = "AuthenticationError";
	}
}


class SteamAuth {
	/**
	 * 
	 * @param {string} verify_callback - Verification URL (yours)
	 * @param {string} realm - Realm (yours)
	 */
	constructor(verify_callback, realm) {
		try {
			this.relyingParty = new openid.RelyingParty(
				verify_callback,
				realm,
				true,
				false,
				[]);
		} catch (e) {
			throw new AuthenticationError(e);
		}
	}
	/**
	 * 
	 * @returns {Promise<string>} URL to send end user to
	 */
	getAuthUrl() {
		return new Promise((resolve, reject) => {
			this.relyingParty.authenticate(identifier, false, function (error, authUrl) {
				if (error)
					reject(new AuthenticationError(error));
				else if (!authUrl)
					reject(new AuthenticationError('Auth url not defined'));
				else
					resolve(authUrl);
			});
		});
	}
	/**
	 * 
	 * @param {Request} request - Request
	 * @returns {number} - Steam ID
	 */
	verify(request) {
		return new Promise((resolve, reject) =>
			this.relyingParty.verifyAssertion(request, function (error, result) {
				if (error)
					reject(new AuthenticationError(error));
				else if (!result.authenticated)
					reject(new AuthenticationError("Not Authenticated!"));
				else {
					let regex = result.claimedIdentifier.match(/\/id\/(\d+)/);
					if (regex != null)
						resolve(regex[1]);
				}
			})
		);
	}
}

module.exports = SteamAuth;