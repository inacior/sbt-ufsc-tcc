// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SBTContract {
   struct SoulToken {
      string identity;
      address caller;
      uint256 timestamp;
      Soul soul;
   }

   struct Soul {
      uint256 id;
      string description;
      address caller;
      string url;
      uint256 timestamp;
   }

   mapping(uint256 => Soul) souls;
   mapping(address => SoulToken[]) soulTokens;
   mapping(address => Soul[]) enabledOperators;
   uint256 public soulsCount;
   uint256 public soulTokensCount;

   address public creator;
   string public name;
   string public id;

   constructor(string memory _name, string memory _id) {
      soulsCount = 0;
      soulTokensCount = 0;
      name = _name;
      id = _id;
      creator = msg.sender;
   }

   function listSouls() public view returns (Soul[] memory){
      Soul[] memory _souls = new Soul[](soulsCount);
      for (uint256 i = 0; i < soulsCount; i++) {
         Soul storage s = souls[i];
         _souls[i] = s;
      }

      return _souls;
   }

   function createSoul(string memory _description, string memory _url) public {
      require(msg.sender == creator, "Only creator can create a soul");
      souls[soulsCount] = Soul(soulsCount, _description, msg.sender, _url, block.timestamp);
      soulsCount++;
   }

   function getSoul(uint256 _soulId) public view returns (Soul memory) {
      return souls[_soulId];
   }

   function removeSoul(uint256 _soulId) public {
      Soul memory _soul = souls[_soulId];
      require(msg.sender == _soul.caller, "Only the creator have rights to delete their soul");
      delete souls[_soulId];
   }

   function createSoulboundToken(uint256 _soulId, string memory _identity, address _address) public {
      Soul memory soul = getSoul(_soulId);
      // require(soul.caller == "", "There is no Soul with this ID");
      soulTokens[_address].push(SoulToken(_identity, msg.sender, block.timestamp, soul));
   }

   function listSoulboundTokens(address _address) public view returns (SoulToken[] memory){
      return soulTokens[_address];
   }

   function enableOperator(address _address, uint256 _soulId) public  {
      require(msg.sender == creator, "Only creator can enable an operator");
      Soul memory _soul = souls[_soulId];
      enabledOperators[_address].push(_soul);
   }
}
