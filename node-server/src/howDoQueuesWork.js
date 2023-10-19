const Queue = require('bull');
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });


const qModifyRouterConfig = new Queue('generateConfig', { redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST, password: process.env.REDIS_PASSWORD } }); 

qModifyRouterConfig.process(async function(job, done){
    if (job.data.generate == 1){
        const {id, fail} = job.data;
        generateRes = await generateRouterOSConfig(fail);
        if (generateRes == 1){
            console.log("FAILED GENERATING ROUTERCONFIG ", id)
            qModifyRouterConfig.add({generate: 0, id: id});
        }else{
            console.log("SUCCESS GENERATING ROUTERCONFIG", id)
        }
        done()
    }else{
        await deleteRouterOSConfig();
        console.log("SUCCESS DELETING ROUTERCONFIG", job.data.id)
        done()
    }
})

generateRouterOSConfig = (willFail) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve(willFail), 1000)
    })
}
deleteRouterOSConfig = () => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve(), 1000)
    })
}

qModifyRouterConfig.add({id: 1, fail:1, generate:1})
qModifyRouterConfig.add({id: 2, fail:0, generate:1})
qModifyRouterConfig.add({id: 4, fail:0, generate:1})
qModifyRouterConfig.add({id: 3, fail:1, generate:1})
