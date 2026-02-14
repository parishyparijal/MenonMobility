<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Elasticsearch Connection
    |--------------------------------------------------------------------------
    */

    'hosts' => [
        env('ELASTICSEARCH_HOST', 'http://localhost:9200'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Elasticsearch Index Prefix
    |--------------------------------------------------------------------------
    */

    'prefix' => env('ELASTICSEARCH_PREFIX', 'menontrucks'),

    /*
    |--------------------------------------------------------------------------
    | Indices Configuration
    |--------------------------------------------------------------------------
    */

    'indices' => [

        'listings' => [
            'name' => env('ELASTICSEARCH_PREFIX', 'menontrucks') . '_listings',
            'settings' => [
                'number_of_shards' => (int) env('ELASTICSEARCH_SHARDS', 1),
                'number_of_replicas' => (int) env('ELASTICSEARCH_REPLICAS', 0),
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication (optional)
    |--------------------------------------------------------------------------
    */

    'username' => env('ELASTICSEARCH_USERNAME'),
    'password' => env('ELASTICSEARCH_PASSWORD'),
    'api_key' => env('ELASTICSEARCH_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | SSL/TLS
    |--------------------------------------------------------------------------
    */

    'ssl_verification' => env('ELASTICSEARCH_SSL_VERIFICATION', true),

];
