// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CampusImpact Treasury
 * @dev Holds the funding (e.g. USDC). Only the Governor contract (the DAO) can execute payouts.
 */
contract CampusTreasury is Ownable {
    // Event emitted when funds are released to a student project
    event FundsReleased(address indexed projectWallet, uint256 amount, address token, string purpose);

    // The owner should be set to the `CampusGovernor` contract address
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Release funds to a project. Can only be called by the DAO (Governor).
     * @param token Address of the ERC20 token to send (e.g., USDC).
     * @param to Address of the student receiving the funds.
     * @param amount Amount to send.
     * @param purpose Detailed description/milestone name for transparency.
     */
    function releaseFunds(
        address token,
        address to,
        uint256 amount,
        string memory purpose
    ) external onlyOwner {
        require(to != address(0), "Cannot send to zero address");
        
        IERC20 paymentToken = IERC20(token);
        require(paymentToken.balanceOf(address(this)) >= amount, "Insufficient treasury balance");

        bool success = paymentToken.transfer(to, amount);
        require(success, "Token transfer failed");

        emit FundsReleased(to, amount, token, purpose);
    }
}
