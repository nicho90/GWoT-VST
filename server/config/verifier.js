/**
 * Verifier for JSON-Webtokens to authenticate a user
 */
module.exports = function(decoded, username){

    // Create current unix-time
    var now = Math.floor(Date.now() / 1000);
    //console.log(decoded.exp);
    //console.log(now);

    // Check if token is not expired
    if(decoded.exp >= now){

        // Check if user is the same user as in token
        if(decoded.username === username){
            return {
                success: true
            };

        } else {
            return {
                success: false,
                message: 'Failed to authenticate this token, because usernames are different'
            };
        }

    } else {
        return {
            success: false,
            message: 'Failed to authenticate with this token, because token expired'
        };
    }
};
