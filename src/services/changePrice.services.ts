import axios from 'axios';

export const changePricetoUSD = async (fsyms: string, price: number): Promise<Number> => {
    console.log(fsyms);
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${fsyms}&tsyms=USD`;
    const response = await axios.get(url);
    const result = response.data.USD * price;
    return result;
};