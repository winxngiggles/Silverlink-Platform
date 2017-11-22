pragma solidity ^0.4.8;

import "./SafeMath.sol";
import './OwnableMultiple.sol';
import './LNKSToken.sol';


contract LNKSExchange is OwnableMultiple {
  using SafeMath for uint;

  struct Order {
    address buyer;
    uint amount;
  }

  LNKSToken token;
  uint fee;
  mapping(address => bool) usedAddresses;
  Order[] orders;

  function LNKSExchange() {
    fee = 30000000000000000; // 0.03 eth
  }

  function setTokenAddress(address _tokenAddress) public onlyOwner {
    token = LNKSToken(_tokenAddress);
  }

  event BuyDirectEvent(address _buyer, uint _amount);

  function buyDirect() public payable {
    Order memory order = Order({
      buyer: msg.sender,
      amount: msg.value
    });

    orders.push(order);
    usedAddresses[msg.sender] = true;

    BuyDirectEvent(order.buyer, order.amount);
  }

  function getOrder(uint _index) public onlyOwner returns (address, uint) {
    Order memory order = orders[_index];
    return (order.buyer, order.amount);
  }

  function approveOrder(uint _index, uint _tokensAmount) public onlyOwner {
    require(orders[_index].amount > 0);

    Order memory order = orders[_index];

    // Deduct $10 if address is never used
    if (usedAddresses[order.buyer] == false) {
      _tokensAmount = _tokensAmount.sub(fee);
      usedAddresses[order.buyer] == true;
    }

    // mint tokens for the buyer
    token.mint(order.buyer, _tokensAmount);

    // remove order from orders array
    orders[_index] = orders[orders.length-1];
    orders.length--;
  }

  function setNewFee(uint _fee) public onlyOwner {
    fee = _fee;
  }

  function getOrdersLength() public onlyOwner returns (uint) {
    return orders.length;
  }

  /*
  * Fallback function in case someone accidentally sends Ether to the contract
   */
  function() payable {}
}


  // function deleteEntity(address entityAddress) public returns(bool success) {
  //   if(!isEntity(entityAddress)) throw;
  //   uint rowToDelete = entityStructs[entityAddress].listPointer;
  //   address keyToMove   = entityList[entityList.length-1];
  //   entityList[rowToDelete] = keyToMove;
  //   entityStructs[keyToMove].listPointer = rowToDelete;
  //   entityList.length--;
  //   return true;
  // }
