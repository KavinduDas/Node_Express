if(process.env.NODE_ENV === 'production'){
    module.exports = {mongourl : 'mongodb+srv://kavindugaya2002_db_user:<db_password>@vidjot-db.wnpyxzt.mongodb.net/?appName=Vidjot-DB'}
}else{
    module.exports = {mongourl : 'mongodb://localhost/vidjot_DB'}
}