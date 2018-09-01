import * as bodyParser from 'body-parser';
import * as express from 'express';
export default class App {

    /**
     * @property {Application} express
     */
    public express: express.Application;

    /**
     * @constructor
     * @description todo
     * @param {string|number} port
     */
    constructor(port: string|number) {
        this.express = express();
        this.express.set('port', port);
        this.middleware();
    }

    /**
     * @name addPostEndPoint
     * @description todo
     * @param {string} endpoint
     * @param {any} response
     */
    public addPostEndPoint(endpoint: string, response: any): void {

        const router = express.Router();
        const responseClass = response;

        router.post(`/${endpoint}`, (req, res, next) => {

            const response = responseClass.apiCall(endpoint, req.body);

            response.then(
                (data: any) => {
                    res.json(data);
                }
            ).catch(
                (data: any) => {
                    res.json(data);
                }
            );
        });
        this.express.use('/', router);
    }

    /**
     * @name listen
     * @description todo
     */
    public listen(): void {
        this.express.listen(this.express.get('port'), () => {
            console.log(
                ('App is running at http://localhost:%d in %s mode'),
                this.express.get('port'),
                this.express.get('env')
            );
            console.log('Press CTRL-C to stop\n');
        });
    }

    /**
     * @name middleware
     * @description todo
     */
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }
}