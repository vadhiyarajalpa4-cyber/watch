const User = require("../models/user");

//for admin
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({});

        const users = await User.find({})
            .select('-password')
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        console.error("FETCH ERROR:", error.message);
        return res.status(500).json({ message: "Error fetching user database" });
    }
};

exports.deleteUser = async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id);
    if(user){
        if (user._id.toString() === req.user._id.toString()){
            return res.status(400).json({ 
                message: "Security Error: You cannot delete the account you are currently logged into." 
            });
        }
        if (user.isAdmin) {
            return res.status(400).json({ 
                message: "Protected Account: This user has Admin privileges and cannot be removed." 
            });
        }
        await user.deleteOne();
        res.json({message:"User removed Successfully"});
    }
    else{
        res.status(500).json({message:"User not found"});
    }
};

//for user
exports.updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: req.token,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};


exports.addAddress = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Not authorized, user token missing" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        const newAddress = {
            label: req.body.label || 'Home',
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country || 'India',
            phone: req.body.phone
        };

        if (!user.addresses) {
            user.addresses = [];
        }
        
        user.addresses.push(newAddress);

        const updatedUser = await user.save();
        
        console.log(" Backend Successfully Saved User Addresses:", updatedUser.addresses);

        res.status(201).json(updatedUser.addresses);

    } catch (error) {
        console.error(" Backend addAddress Error:", error);
        res.status(500).json({ 
            message: "Failed to save address to database", 
            error: error.message 
        });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addressIndex = user.addresses.findIndex(
            (addr) => addr._id.toString() === req.params.id
        );

        if (addressIndex !== -1) {
            user.addresses[addressIndex].label = req.body.label || user.addresses[addressIndex].label;
            user.addresses[addressIndex].address = req.body.address || user.addresses[addressIndex].address;
            user.addresses[addressIndex].city = req.body.city || user.addresses[addressIndex].city;
            user.addresses[addressIndex].postalCode = req.body.postalCode || user.addresses[addressIndex].postalCode;
            user.addresses[addressIndex].phone = req.body.phone || user.addresses[addressIndex].phone;
            
            await user.save();
            return res.json(user.addresses);
        } else {
            return res.status(404).json({ message: "Address not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(
            (addr) => addr._id.toString() !== req.params.id
        );
        await user.save();
        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: "Failed to delete address" });
    }
};

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      addresses: user.addresses,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};