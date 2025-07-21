import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    apiUrl: process.env.API_URL || 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator'
};
