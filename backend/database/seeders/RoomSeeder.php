<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Room::create(['name' => 'Room 1']);
        Room::create(['name' => 'Room 2']);
        Room::create(['name' => 'Room 3']);
        Room::create(['name' => 'Room 4']);
    }
}
