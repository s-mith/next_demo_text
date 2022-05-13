import lodash from 'lodash';
import database from '../../../example_database/steam_inventory.json';


export default function handler(req, res) {
    // return the json in example_database/steam_inventory.json
    res.status(200).json(database);

    
}
