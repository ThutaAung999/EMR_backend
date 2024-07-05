
import  dovenv from 'dotenv'

interface Config {
    db: string;
}

const config: Config = {
    /*db: 'mongodb://0.0.0.0:27017/electrical_medicine_record'*/
    //    db: 'mongodb+srv://exercise999123:htein@cluster0.nx2m3ak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    db : process.env.DATABASE as string,
};



export default config;
