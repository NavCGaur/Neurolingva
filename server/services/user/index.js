import { UserSchema } from '../../models/userSchema.js'; 
import mongoose from 'mongoose';

const User = mongoose.model('User', UserSchema);

const userService = {
  /**
   * Get all users from the database
   */
   getUser: async ({ role, page, pageSize, sort, search }) => {
    // Generate sort object
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      return {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };
    };
  
    const sortFormatted = sort ? generateSort() : {};


      
      // Role-based filter
      let roleFilter = {};

      if (role === "Reseller") {
        roleFilter = { role: "Agency" };
      } else if (role === "Agency") {
        roleFilter = { role: "Client" };
      } else if (role === "Client" || role === "Guest") {
        // Client and Guest shouldn't see any users
        return { users: [], total: 0 };
      }
      // Admin gets all users (no filter)

  
    // Build search query
    const searchQuery = search
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { phone_number: { $regex: search, $options: "i" } },
            ],
          },
          roleFilter,
        ],
      }
    : roleFilter;
  
    // Fetch users from DB
    const users = await User.find(searchQuery)
      .select("_id name email phone_number role createdAt services")
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

      console.log("Users fetched from DB in service:", users, role);
  
    const total = await User.countDocuments(searchQuery);

  
    return { users, total };
  },
  

  /**
   * Get user by ID
   */
  getUserById: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
      }
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData) => {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  },

  /**
   * Edit user details
   */
  editUser: async (id, userData) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
      }
      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  },

  /**
   * Delete user by ID
   */
  deleteUser: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
      }
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('User not found');
      return deletedUser;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
};

export default userService;
