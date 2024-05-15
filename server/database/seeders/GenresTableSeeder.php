<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class GenresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('genres')->insert([
            'name' => 'Japanese music',            
        ]);
        
        DB::table('genres')->insert([
            'name' => 'Foreign music',            
        ]);
        
        DB::table('genres')->insert([
            'name' => 'Others',            
        ]);
        
    }
}
