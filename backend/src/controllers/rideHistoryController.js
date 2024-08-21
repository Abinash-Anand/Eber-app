const Invoice = require('../models/invoice');
const Booking = require('../models/rideBookings');

const rideHistory = async (req, res) => {
    try {
        const rideData = await Booking.aggregate([
            {
                $lookup: {
                    from: 'invoices', // Correct collection name
                    localField: '_id', // Field in bookings collection (assuming _id is the booking ID)
                    foreignField: 'bookingId', // Field in invoices collection that references booking
                    as: 'invoiceDetails' // The alias for the joined data
                }
            },
            {
                $unwind: {
                    path: '$invoiceDetails',
                    preserveNullAndEmptyArrays: true // Keep bookings without invoices (e.g., canceled rides)
                }
            },
                        {
                $lookup: {
                    from: 'usermodels', // Join with users collection
                    localField: 'userId', // Match userId from bookings
                    foreignField: '_id', // With _id from users
                    as: 'userId' // Alias for the result
                }
            },
              {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true // Keep bookings without invoices (e.g., canceled rides)
                }
            },
               {
                $lookup: {
                    from: 'zonemodels', // Join with users collection
                    localField: 'city', // Match userId from bookings
                    foreignField: '_id', // With _id from users
                    as: 'city' // Alias for the result
                }
            },
             {  
                $unwind: {
                    path: '$city',
                    preserveNullAndEmptyArrays: true // Keep bookings without invoices (e.g., canceled rides)
                }
            },
            {
                $match: {
                    $or: [
                        { status: 'Completed' },
                        { status: 'Cancelled' }
                    ]
                }
            },
        ])

        if (!rideData || rideData.length === 0) {
            throw new Error("No rides found!");
        }

        console.log(`---------------RIDES-------------`, rideData); // Log the rideData properly
        res.status(200).json({ success: true, data: rideData });
    } catch (error) {
        console.error('Error in rideHistory:', error); // Log the full error details
        res.status(500).json({ success: false, error: error.message });
    }
};


const filteredHistory = async (req, res)=>{
 try {
     const filter = req.params.id;
     console.log(filter)
     const rideHistory = await Booking.aggregate([
            {
                $lookup: {
                    from: 'invoices', // Correct collection name
                    localField: '_id', // Field in bookings collection (assuming _id is the booking ID)
                    foreignField: 'bookingId', // Field in invoices collection that references booking
                    as: 'invoiceDetails' // The alias for the joined data
                }
            },
            {
                $unwind: {
                    path: '$invoiceDetails',
                    preserveNullAndEmptyArrays: true // Keep bookings without invoices (e.g., canceled rides)
                }
            },
                        {
                $lookup: {
                    from: 'usermodels', // Join with users collection
                    localField: 'userId', // Match userId from bookings
                    foreignField: '_id', // With _id from users
                    as: 'userId' // Alias for the result
                }
            },
              {
                $unwind: {
                    path: '$userId',
                    preserveNullAndEmptyArrays: true // Keep bookings without invoices (e.g., canceled rides)
                }
            },
               {
                $lookup: {
                    from: 'zonemodels', // Join with users collection
                    localField: 'city', // Match userId from bookings
                    foreignField: '_id', // With _id from users
                    as: 'city' // Alias for the result
                }
            },
             {  
                $unwind: {
                    path: '$city',
                    preserveNullAndEmptyArrays: true // Keep bookings without invoices (e.g., canceled rides)
                }
            },
            {
                $match: {
                    $or: [
                        { status: 'Completed' },
                        { status: 'Cancelled' }
                    ]
                }
            },
     ])
     
     const filterHistory = rideHistory.filter((ride) => {
         return ride.status.toLowerCase() === filter.toLowerCase()
     })
     
     res.status(201).send(filterHistory);
 } catch (error) {
    res.status(500).send(error)
 }
}

module.exports = { rideHistory, filteredHistory };