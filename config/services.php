<?php
 
 return [
 
     /*
     |--------------------------------------------------------------------------
     | Third Party Services
     |--------------------------------------------------------------------------
     |
     | This file is for storing the credentials for third party services such
     | as Stripe, Mailgun, SparkPost and others. This file provides a sane
     | default location for this type of information, allowing packages
     | to have a conventional place to find your various credentials.
     |
     */
 
     'mailgun' => [
         'domain' => env('MAILGUN_DOMAIN'),
         'secret' => env('MAILGUN_SECRET'),
     ],
 
     'ses' => [
         'key' => env('SES_KEY'),
         'secret' => env('SES_SECRET'),
         'region' => 'us-east-1',
     ],
 
     'sparkpost' => [
         'secret' => env('SPARKPOST_SECRET'),
     ],
 
     'stripe' => [
         'model' => App\User::class,
         'key' => env('STRIPE_KEY'),
         'secret' => env('STRIPE_SECRET'),
     ],
 
     'google' => [
         'client_id' => '81197200725-f8jkqatcd1cj1lv6e12g04cj3mm5gdd8.apps.googleusercontent.com',
         'client_secret' => 'ZwGxDpyOCdbnZC_Z4plR243L',
         'redirect' => env('APP_URL', 'https://folk.ntnu.no/eiviland/yadahreg').'/callback',
     ],
 ];