stage ('RUN TEST'){
            sh '''
                    git config --global http.sslVerify "false"
                    git clone -b main https://${USERNAME}:${PASSWORD}@github.com/kickonsly/test_rabbit.git
                    npm install
                    npm run cypress:run cypress/integration/test.spec.js 
                    newman run newman/order_pizza.postman_collection.json --insecure --suppress-exit-code --reporters cli,htmlextra,junit --reporter-htmlextra-export newman/report.html --reporter-junit-export newman/report.xml --delay-request 2000 -e newman/order_pizza_env.postman_environment.json
            '''
        }