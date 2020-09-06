import rp from 'request-promise';

class TransactionHelper {
    public async getEUR() {
        return new Promise((resolve, reject) => {
            const api_key = process.env.COINT_MARKET_API_KEY;
            const requestOptions = {
                method: 'GET',
                uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
                qs: {
                    'symbol': 'ETH',
                    // 'convert': 'EUR'
                },
                headers: {
                    'X-CMC_PRO_API_KEY': api_key
                },
                json: true,
                gzip: true
            };

            rp(requestOptions).then(response => {
                console.log('API call response:', response);
                // const { data: { ETH } } = response;
                // const { quote: { EUR } } = ETH;
                // resolve(EUR);
                const { data: { ETH } } = response;
                const { quote: { USD } } = ETH;
                resolve(USD);

            }).catch((err) => {
                // console.log('API call error:', err.message);
                reject(err);
            });
        });
    }

}

export default new TransactionHelper();