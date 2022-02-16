import db from '../config/db';


const get_all_cat_food = () =>{
    let sql = `SELECT * FROM category;`;
    
    categories = db.execute(sql);

    console.log(categories)
}


get_all_cat_food();