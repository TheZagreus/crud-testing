<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Booking::with('room')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        // Check availability
        if ($this->isOverlapping($validated['room_id'], $validated['date'], $validated['start_time'], $validated['end_time'])) {
            return response()->json(['error' => 'Room not available at this time'], 409);
        }

        $booking = Booking::create($validated);

        return response()->json($booking->load('room'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        return $booking->load('room');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        // Check availability, excluding current booking
        if ($this->isOverlapping($validated['room_id'], $validated['date'], $validated['start_time'], $validated['end_time'], $booking->id)) {
            return response()->json(['error' => 'Room not available at this time'], 409);
        }

        $booking->update($validated);

        return $booking->load('room');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();

        return response()->json(null, 204);
    }

    private function isOverlapping($roomId, $date, $start, $end, $excludeId = null)
    {
        $query = Booking::where('room_id', $roomId)
            ->where('date', $date)
            ->where(function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                  ->where('end_time', '>', $start);
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
