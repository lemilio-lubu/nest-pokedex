// Una funcion que retorna un objeto de configuracion
// esta funcion se usa en el app.module.ts
// para cargar las variables de entorno
// y usarlas en cualquier parte de la aplicacion
// sin necesidad de usar process.env
export const AppConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3000,
    limitResults: +(process.env.LIMIT_RESULTS ?? 5),
});