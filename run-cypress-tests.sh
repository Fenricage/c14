printf 'Waiting for server to start.'
until $(curl --output /dev/null --silent --head --fail http://localhost:3000); do
    printf '.'
    sleep 5
done

sleep 20;

npx cypress run --record --key 08ccf44d-e082-4aa7-a534-616f7aa33e1d --spec "$(node cypress/cypress-parallel.js)"
