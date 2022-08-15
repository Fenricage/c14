printf 'Waiting for server to start.'
until $(curl --output /dev/null --silent --head --fail http://localhost:3000); do
    printf '.'
    sleep 5
done

sleep 20;
