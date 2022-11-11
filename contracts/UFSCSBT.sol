// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract UFSCSBT {
   event Mint(string _tokenId, string _tokenReference, address _receiver);
   event Burn(string _tokenId);
   event EnabledOperator(address _address, string _tokenReference);
   event DisabledOperator(address _address, string _tokenReference);

   struct SoulboundToken {
      string tokenId;
      string tokenReference;
      address sender;
      address receiver;
      uint256 timestamp;
   }

   mapping (string => SoulboundToken) soulboundTokens;
   mapping (address => string[]) enabledOperators;

   address public creator;
   string public name;
   string public id;

   constructor(string memory _name, string memory _id) {
      name = _name;
      id = _id;
      creator = msg.sender;
   }

   function _exists(string memory tokenId) internal view virtual returns (bool) {
      return keccak256(abi.encodePacked(soulboundTokens[tokenId].tokenId)) != keccak256(abi.encodePacked(""));
   }

   function _isOperator(address _address) internal view virtual returns (bool) {
      if(enabledOperators[_address].length > 0){
         return true;
      }

      return false;
   }

   function _isOperatorAllowedTo(address _address, string memory _tokenReference) internal view virtual returns (bool) {
      if (!_isOperator(_address)) return false;

      for (uint i = 0; i < enabledOperators[_address].length; i++) {
         if (keccak256(abi.encodePacked(enabledOperators[_address][i])) == keccak256(abi.encodePacked(_tokenReference))) {
            return true;
         }
      }

      return false;
   }

   function getOperator(address _address) public view returns (string[] memory) {
      return enabledOperators[_address];
   }

   function ownerOf(string memory tokenId) public view returns (address) {
      return soulboundTokens[tokenId].receiver;
   }

   function mint(string memory _tokenId, string memory _tokenReference, address _receiver) external {
      require(!_exists(_tokenId), "There is already a SoulboundToken with given tokenId");
      require(_isOperatorAllowedTo(msg.sender, _tokenReference) || msg.sender == creator, "You arent enabled to manage this tokenReference");
      soulboundTokens[_tokenId] = SoulboundToken(_tokenId, _tokenReference, msg.sender, _receiver, block.timestamp);

      emit Mint(_tokenId, _tokenReference, _receiver);
   }

   function burn(string memory _tokenId) external {
      require(_exists(_tokenId), "There isnt a SoulboundToken with given tokenId");
      require(_isOperatorAllowedTo(msg.sender, soulboundTokens[_tokenId].tokenReference) || msg.sender == creator, "You arent enabled to manage this tokenReference");

      delete soulboundTokens[_tokenId];
      emit Burn(_tokenId);
   }

   function enableOperator(address _address, string memory _tokenReference) external {
      require(msg.sender == creator, "Only the creator can allow new operators");
      require(!_isOperatorAllowedTo(_address, _tokenReference), "Operator are already enabled to manage this identifier");

      enabledOperators[_address].push(_tokenReference);
      emit EnabledOperator(_address, _tokenReference);
   }

   function disableOperator(address _address, string memory _tokenReference) external {
      require(msg.sender == creator, "Only the creator can allow new operators");
      require(_isOperatorAllowedTo(_address, _tokenReference), "Operator arent enabled to manage this identifier");

      string[] memory newTokenReferenceList = new string[](enabledOperators[_address].length - 1);
      uint256 resultCount = 0;

      for (uint i = 0; i < enabledOperators[_address].length; i++) {
         if (keccak256(abi.encodePacked(enabledOperators[_address][i])) != keccak256(abi.encodePacked(_tokenReference))) {
            newTokenReferenceList[resultCount] = enabledOperators[_address][i];
            resultCount++;
         }
      }

      enabledOperators[_address] = newTokenReferenceList;

      emit DisabledOperator(_address, _tokenReference);
   }
}
