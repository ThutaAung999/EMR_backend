
import  dotenv from 'dotenv'
dotenv.config();

interface Config {
    db: string;
}

const config: Config = {
    //db: 'mongodb://0.0.0.0:27017/electrical_medicine_record'
    //db: 'mongodb+srv://exercise999123:htein@cluster0.nx2m3ak.mongodb.net/Electrical_Medicine_Record'

        db : process.env.DATABASE as string,
    //db : process.env.DATABASE_LOCAL as string,
};

export default config;


