// login support with openid
const openid = require('openid');
const identifier = 'https://steamcommunity.com/openid';

class AuthenticationError extends Error {
	constructor(message) {
		super(message);
		this.name = "AuthenticationError";
	}
}


class SteamAuth {
	constructor(verify_callback, realm) {
		try {
			this.relyingParty = new openid.RelyingParty(
				verify_callback, // Verification URL (yours)
				realm, // Realm (optional, specifies realm for OpenID authentication)
				true, // Use stateless verification
				false, // Strict mode
				[]); // List of extensions to enable and include
		} catch (e) {
			throw new AuthenticationError(e);
		}
	}
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