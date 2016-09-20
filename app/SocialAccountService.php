<?php

namespace App;

use Laravel\Socialite\Contracts\User as ProviderUser;

class SocialAccountService {
    public function createOrGetUser(ProviderUser $providerUser) {
        $user = User::where('google_id', $providerUser->getId())
            ->first();

        if ($user) {
            return $user;
        } else {
            $existingUser = User::where('email', $providerUser->getEmail())->first();

            if($existingUser) {
                // User with that email already exists
                return false;
            }

            $user = User::create([
                'email' => $providerUser->getEmail(),
                'name' => $providerUser->getName(),
                'google_id' => $providerUser->getId(),
                'role' => 'unactivated',
            ]);

            return $user;
        }

    }
}