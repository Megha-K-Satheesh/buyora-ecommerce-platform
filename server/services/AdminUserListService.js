const User = require("../models/User");
const { ErrorFactory } = require("../utils/errors");
const { notifyUserUnbanned, notifyUserBanned } = require("../utils/socket");

class AdminUserListService {

  
  static async getUsers({ page = 1, limit = 10, status, search }) {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select("_id name email status role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers,
    };
  }

  static async banUser(userId, adminId, reason) {
    const user = await User.findById(userId);
    if (!user) throw ErrorFactory.notFound("User not found");

    user.status = "banned";
    user.banReason = reason || "No reason provided";
    user.bannedAt = new Date();
    user.bannedBy = adminId || null;

    await user.save();
      notifyUserBanned(user._id, user.name, adminId);

    return { message: "User has been banned", user: user.getPublicProfile() };
  }

  static async unbanUser(userId,adminId) {
    const user = await User.findById(userId);
    if (!user) throw ErrorFactory.notFound("User not found");

    user.status = "active";
    user.banReason = null;
    user.bannedAt = null;
    user.bannedBy = null;

    await user.save();
  notifyUserUnbanned(user._id, user.name, adminId);
    return { message: "User has been unbanned", user: user.getPublicProfile() };
  }

  static async findUser({ userId, email }) {
    const query = {};
    if (userId) query._id = userId;
    if (email) query.email = email.toLowerCase();

    const user = await User.findOne(query)
      .select("_id name email status role")
      .lean();

    if (!user) throw ErrorFactory.notFound("User not found");
    return user;
  }
}

module.exports = AdminUserListService;
