}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractEmergencyStopToggled)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractEmergencyStopToggled)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractEmergencyStopToggledIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractEmergencyStopToggledIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractEmergencyStopToggled represents a EmergencyStopToggled event raised by the Contract contract.
type ContractEmergencyStopToggled struct { 
IsStopped bool; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterEmergencyStopToggled is a free log retrieval operation binding the contract event 0x05b88d23d9a60b7924fccc370e1e0c1ccf49989e3b2968cafaf7db7fc13bd13f.
//
// Solidity: event EmergencyStopToggled(bool isStopped)
func (_Contract *ContractFilterer) FilterEmergencyStopToggled(opts *bind.FilterOpts) (*ContractEmergencyStopToggledIterator, error) {



logs, sub, err := _Contract.contract.FilterLogs(opts, "EmergencyStopToggled")
if err != nil {
        return nil, err
}
return &ContractEmergencyStopToggledIterator{contract: _Contract.contract, event: "EmergencyStopToggled", logs: logs, sub: sub}, nil
}

// WatchEmergencyStopToggled is a free log subscription operation binding the contract event 0x05b88d23d9a60b7924fccc370e1e0c1ccf49989e3b2968cafaf7db7fc13bd13f.
//
// Solidity: event EmergencyStopToggled(bool isStopped)
func (_Contract *ContractFilterer) WatchEmergencyStopToggled(opts *bind.WatchOpts, sink chan<- *ContractEmergencyStopToggled) (event.Subscription, error) {



logs, sub, err := _Contract.contract.WatchLogs(opts, "EmergencyStopToggled")
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractEmergencyStopToggled)
                        if err := _Contract.contract.UnpackLog(event, "EmergencyStopToggled", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseEmergencyStopToggled is a log parse operation binding the contract event 0x05b88d23d9a60b7924fccc370e1e0c1ccf49989e3b2968cafaf7db7fc13bd13f.
//
// Solidity: event EmergencyStopToggled(bool isStopped)
func (_Contract *ContractFilterer) ParseEmergencyStopToggled(log types.Log) (*ContractEmergencyStopToggled, error) {
event := new(ContractEmergencyStopToggled)
if err := _Contract.contract.UnpackLog(event, "EmergencyStopToggled", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}


// ContractEntitymintedIterator is returned from FilterEntityminted and is used to iterate over the raw logs and unpacked data for Entityminted events raised by the Contract contract.
type ContractEntitymintedIterator struct {
Event *ContractEntityminted // Event containing the contract specifics and raw log

contract *bind.BoundContract // Generic contract to use for unpacking event data
event    string              // Event name to use for unpacking event data

logs chan types.Log        // Log channel receiving the found contract events
sub  ethereum.Subscription // Subscription for errors, completion and termination
done bool                  // Whether the subscription completed delivering logs
fail error                 // Occurred error to stop iteration
}
// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ContractEntitymintedIterator) Next() bool {
// If the iterator failed, stop iterating
if (it.fail != nil) {
        return false
}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractEntityminted)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractEntityminted)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractEntitymintedIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractEntitymintedIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractEntityminted represents a Entityminted event raised by the Contract contract.
type ContractEntityminted struct { 
TokenId *big.Int; 
EntityType uint8; 
ClaimShare *big.Int; 
BreedPotential *big.Int; 
Generation *big.Int; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterEntityminted is a free log retrieval operation binding the contract event 0x28faeeac2ed413e9abab9eaf3569916ab25f4c368c13d43cc29b2f0f4a4e6d4e.
//
// Solidity: event Entityminted(uint256 indexed tokenId, uint8 entityType, uint256 claimShare, uint256 breedPotential, uint256 generation)
func (_Contract *ContractFilterer) FilterEntityminted(opts *bind.FilterOpts, tokenId []*big.Int) (*ContractEntitymintedIterator, error) {

var tokenIdRule []interface{}
for _, tokenIdItem := range tokenId {
        tokenIdRule = append(tokenIdRule, tokenIdItem)
}





logs, sub, err := _Contract.contract.FilterLogs(opts, "Entityminted", tokenIdRule)
if err != nil {
        return nil, err
}
return &ContractEntitymintedIterator{contract: _Contract.contract, event: "Entityminted", logs: logs, sub: sub}, nil
}

// WatchEntityminted is a free log subscription operation binding the contract event 0x28faeeac2ed413e9abab9eaf3569916ab25f4c368c13d43cc29b2f0f4a4e6d4e.
//
// Solidity: event Entityminted(uint256 indexed tokenId, uint8 entityType, uint256 claimShare, uint256 breedPotential, uint256 generation)
func (_Contract *ContractFilterer) WatchEntityminted(opts *bind.WatchOpts, sink chan<- *ContractEntityminted, tokenId []*big.Int) (event.Subscription, error) {

var tokenIdRule []interface{}
for _, tokenIdItem := range tokenId {
        tokenIdRule = append(tokenIdRule, tokenIdItem)
}





logs, sub, err := _Contract.contract.WatchLogs(opts, "Entityminted", tokenIdRule)
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractEntityminted)
                        if err := _Contract.contract.UnpackLog(event, "Entityminted", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseEntityminted is a log parse operation binding the contract event 0x28faeeac2ed413e9abab9eaf3569916ab25f4c368c13d43cc29b2f0f4a4e6d4e.
//
// Solidity: event Entityminted(uint256 indexed tokenId, uint8 entityType, uint256 claimShare, uint256 breedPotential, uint256 generation)
func (_Contract *ContractFilterer) ParseEntityminted(log types.Log) (*ContractEntityminted, error) {
event := new(ContractEntityminted)
if err := _Contract.contract.UnpackLog(event, "Entityminted", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}


// ContractOwnershipRenouncedIterator is returned from FilterOwnershipRenounced and is used to iterate over the raw logs and unpacked data for OwnershipRenounced events raised by the Contract contract.
type ContractOwnershipRenouncedIterator struct {
Event *ContractOwnershipRenounced // Event containing the contract specifics and raw log

contract *bind.BoundContract // Generic contract to use for unpacking event data
event    string              // Event name to use for unpacking event data

logs chan types.Log        // Log channel receiving the found contract events
sub  ethereum.Subscription // Subscription for errors, completion and termination
done bool                  // Whether the subscription completed delivering logs
fail error                 // Occurred error to stop iteration
}
// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ContractOwnershipRenouncedIterator) Next() bool {
// If the iterator failed, stop iterating
if (it.fail != nil) {
        return false
}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractOwnershipRenounced)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractOwnershipRenounced)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractOwnershipRenouncedIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractOwnershipRenouncedIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractOwnershipRenounced represents a OwnershipRenounced event raised by the Contract contract.
type ContractOwnershipRenounced struct { 
PreviousOwner common.Address; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterOwnershipRenounced is a free log retrieval operation binding the contract event 0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820.
//
// Solidity: event OwnershipRenounced(address indexed previousOwner)
func (_Contract *ContractFilterer) FilterOwnershipRenounced(opts *bind.FilterOpts, previousOwner []common.Address) (*ContractOwnershipRenouncedIterator, error) {

var previousOwnerRule []interface{}
for _, previousOwnerItem := range previousOwner {
        previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
}

logs, sub, err := _Contract.contract.FilterLogs(opts, "OwnershipRenounced", previousOwnerRule)
if err != nil {
        return nil, err
}
return &ContractOwnershipRenouncedIterator{contract: _Contract.contract, event: "OwnershipRenounced", logs: logs, sub: sub}, nil
}

// WatchOwnershipRenounced is a free log subscription operation binding the contract event 0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820.
//
// Solidity: event OwnershipRenounced(address indexed previousOwner)
func (_Contract *ContractFilterer) WatchOwnershipRenounced(opts *bind.WatchOpts, sink chan<- *ContractOwnershipRenounced, previousOwner []common.Address) (event.Subscription, error) {

var previousOwnerRule []interface{}
for _, previousOwnerItem := range previousOwner {
        previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
}

logs, sub, err := _Contract.contract.WatchLogs(opts, "OwnershipRenounced", previousOwnerRule)
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractOwnershipRenounced)
                        if err := _Contract.contract.UnpackLog(event, "OwnershipRenounced", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseOwnershipRenounced is a log parse operation binding the contract event 0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820.
//
// Solidity: event OwnershipRenounced(address indexed previousOwner)
func (_Contract *ContractFilterer) ParseOwnershipRenounced(log types.Log) (*ContractOwnershipRenounced, error) {
event := new(ContractOwnershipRenounced)
if err := _Contract.contract.UnpackLog(event, "OwnershipRenounced", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}


// ContractOwnershipTransferAttemptedIterator is returned from FilterOwnershipTransferAttempted and is used to iterate over the raw logs and unpacked data for OwnershipTransferAttempted events raised by the Contract contract.
type ContractOwnershipTransferAttemptedIterator struct {
Event *ContractOwnershipTransferAttempted // Event containing the contract specifics and raw log

contract *bind.BoundContract // Generic contract to use for unpacking event data
event    string              // Event name to use for unpacking event data

logs chan types.Log        // Log channel receiving the found contract events
sub  ethereum.Subscription // Subscription for errors, completion and termination
done bool                  // Whether the subscription completed delivering logs
fail error                 // Occurred error to stop iteration
}
// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ContractOwnershipTransferAttemptedIterator) Next() bool {
// If the iterator failed, stop iterating
if (it.fail != nil) {
        return false
}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractOwnershipTransferAttempted)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractOwnershipTransferAttempted)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractOwnershipTransferAttemptedIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractOwnershipTransferAttemptedIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractOwnershipTransferAttempted represents a OwnershipTransferAttempted event raised by the Contract contract.
type ContractOwnershipTransferAttempted struct { 
From common.Address; 
To common.Address; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferAttempted is a free log retrieval operation binding the contract event 0x482931717bf2b34c4126b5d5ca8cb27f0bacdf00d8eac1ac8add472e71c8034d.
//
// Solidity: event OwnershipTransferAttempted(address indexed from, address indexed to)
func (_Contract *ContractFilterer) FilterOwnershipTransferAttempted(opts *bind.FilterOpts, from []common.Address, to []common.Address) (*ContractOwnershipTransferAttemptedIterator, error) {

var fromRule []interface{}
for _, fromItem := range from {
        fromRule = append(fromRule, fromItem)
}
var toRule []interface{}
for _, toItem := range to {
        toRule = append(toRule, toItem)
}

logs, sub, err := _Contract.contract.FilterLogs(opts, "OwnershipTransferAttempted", fromRule, toRule)
if err != nil {
        return nil, err
}
return &ContractOwnershipTransferAttemptedIterator{contract: _Contract.contract, event: "OwnershipTransferAttempted", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferAttempted is a free log subscription operation binding the contract event 0x482931717bf2b34c4126b5d5ca8cb27f0bacdf00d8eac1ac8add472e71c8034d.
//
// Solidity: event OwnershipTransferAttempted(address indexed from, address indexed to)
func (_Contract *ContractFilterer) WatchOwnershipTransferAttempted(opts *bind.WatchOpts, sink chan<- *ContractOwnershipTransferAttempted, from []common.Address, to []common.Address) (event.Subscription, error) {

var fromRule []interface{}
for _, fromItem := range from {
        fromRule = append(fromRule, fromItem)
}
var toRule []interface{}
for _, toItem := range to {
        toRule = append(toRule, toItem)
}

logs, sub, err := _Contract.contract.WatchLogs(opts, "OwnershipTransferAttempted", fromRule, toRule)
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractOwnershipTransferAttempted)
                        if err := _Contract.contract.UnpackLog(event, "OwnershipTransferAttempted", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseOwnershipTransferAttempted is a log parse operation binding the contract event 0x482931717bf2b34c4126b5d5ca8cb27f0bacdf00d8eac1ac8add472e71c8034d.
//
// Solidity: event OwnershipTransferAttempted(address indexed from, address indexed to)
func (_Contract *ContractFilterer) ParseOwnershipTransferAttempted(log types.Log) (*ContractOwnershipTransferAttempted, error) {
event := new(ContractOwnershipTransferAttempted)
if err := _Contract.contract.UnpackLog(event, "OwnershipTransferAttempted", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}


// ContractOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the Contract contract.
type ContractOwnershipTransferredIterator struct {
Event *ContractOwnershipTransferred // Event containing the contract specifics and raw log

contract *bind.BoundContract // Generic contract to use for unpacking event data
event    string              // Event name to use for unpacking event data

logs chan types.Log        // Log channel receiving the found contract events
sub  ethereum.Subscription // Subscription for errors, completion and termination
done bool                  // Whether the subscription completed delivering logs
fail error                 // Occurred error to stop iteration
}
// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ContractOwnershipTransferredIterator) Next() bool {
// If the iterator failed, stop iterating
if (it.fail != nil) {
        return false
}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractOwnershipTransferred)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractOwnershipTransferred)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractOwnershipTransferredIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractOwnershipTransferredIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractOwnershipTransferred represents a OwnershipTransferred event raised by the Contract contract.
type ContractOwnershipTransferred struct { 
PreviousOwner common.Address; 
NewOwner common.Address; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Contract *ContractFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*ContractOwnershipTransferredIterator, error) {

var previousOwnerRule []interface{}
for _, previousOwnerItem := range previousOwner {
        previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
}
var newOwnerRule []interface{}
for _, newOwnerItem := range newOwner {
        newOwnerRule = append(newOwnerRule, newOwnerItem)
}

logs, sub, err := _Contract.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
if err != nil {
        return nil, err
}
return &ContractOwnershipTransferredIterator{contract: _Contract.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Contract *ContractFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *ContractOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

var previousOwnerRule []interface{}
for _, previousOwnerItem := range previousOwner {
        previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
}
var newOwnerRule []interface{}
for _, newOwnerItem := range newOwner {
        newOwnerRule = append(newOwnerRule, newOwnerItem)
}

logs, sub, err := _Contract.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractOwnershipTransferred)
                        if err := _Contract.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_Contract *ContractFilterer) ParseOwnershipTransferred(log types.Log) (*ContractOwnershipTransferred, error) {
event := new(ContractOwnershipTransferred)
if err := _Contract.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}


// ContractTokenBurnedIterator is returned from FilterTokenBurned and is used to iterate over the raw logs and unpacked data for TokenBurned events raised by the Contract contract.
type ContractTokenBurnedIterator struct {
Event *ContractTokenBurned // Event containing the contract specifics and raw log

contract *bind.BoundContract // Generic contract to use for unpacking event data
event    string              // Event name to use for unpacking event data

logs chan types.Log        // Log channel receiving the found contract events
sub  ethereum.Subscription // Subscription for errors, completion and termination
done bool                  // Whether the subscription completed delivering logs
fail error                 // Occurred error to stop iteration
}
// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ContractTokenBurnedIterator) Next() bool {
// If the iterator failed, stop iterating
if (it.fail != nil) {
        return false
}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractTokenBurned)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractTokenBurned)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractTokenBurnedIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractTokenBurnedIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractTokenBurned represents a TokenBurned event raised by the Contract contract.
type ContractTokenBurned struct { 
TokenId *big.Int; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterTokenBurned is a free log retrieval operation binding the contract event 0x0c526103b8f47af5516191d0c89a598755bd00faa211a3cb52e4c2cc782f7fe2.
//
// Solidity: event TokenBurned(uint256 indexed tokenId)
func (_Contract *ContractFilterer) FilterTokenBurned(opts *bind.FilterOpts, tokenId []*big.Int) (*ContractTokenBurnedIterator, error) {

var tokenIdRule []interface{}
for _, tokenIdItem := range tokenId {
        tokenIdRule = append(tokenIdRule, tokenIdItem)
}

logs, sub, err := _Contract.contract.FilterLogs(opts, "TokenBurned", tokenIdRule)
if err != nil {
        return nil, err
}
return &ContractTokenBurnedIterator{contract: _Contract.contract, event: "TokenBurned", logs: logs, sub: sub}, nil
}

// WatchTokenBurned is a free log subscription operation binding the contract event 0x0c526103b8f47af5516191d0c89a598755bd00faa211a3cb52e4c2cc782f7fe2.
//
// Solidity: event TokenBurned(uint256 indexed tokenId)
func (_Contract *ContractFilterer) WatchTokenBurned(opts *bind.WatchOpts, sink chan<- *ContractTokenBurned, tokenId []*big.Int) (event.Subscription, error) {

var tokenIdRule []interface{}
for _, tokenIdItem := range tokenId {
        tokenIdRule = append(tokenIdRule, tokenIdItem)
}

logs, sub, err := _Contract.contract.WatchLogs(opts, "TokenBurned", tokenIdRule)
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractTokenBurned)
                        if err := _Contract.contract.UnpackLog(event, "TokenBurned", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseTokenBurned is a log parse operation binding the contract event 0x0c526103b8f47af5516191d0c89a598755bd00faa211a3cb52e4c2cc782f7fe2.
//
// Solidity: event TokenBurned(uint256 indexed tokenId)
func (_Contract *ContractFilterer) ParseTokenBurned(log types.Log) (*ContractTokenBurned, error) {
event := new(ContractTokenBurned)
if err := _Contract.contract.UnpackLog(event, "TokenBurned", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}


// ContractTransferIterator is returned from FilterTransfer and is used to iterate over the raw logs and unpacked data for Transfer events raised by the Contract contract.
type ContractTransferIterator struct {
Event *ContractTransfer // Event containing the contract specifics and raw log

contract *bind.BoundContract // Generic contract to use for unpacking event data
event    string              // Event name to use for unpacking event data

logs chan types.Log        // Log channel receiving the found contract events
sub  ethereum.Subscription // Subscription for errors, completion and termination
done bool                  // Whether the subscription completed delivering logs
fail error                 // Occurred error to stop iteration
}
// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *ContractTransferIterator) Next() bool {
// If the iterator failed, stop iterating
if (it.fail != nil) {
        return false
}
// If the iterator completed, deliver directly whatever's available
if (it.done) {
        select {
        case log := <-it.logs:
                it.Event = new(ContractTransfer)
                if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                        it.fail = err
                        return false
                }
                it.Event.Raw = log
                return true

        default:
                return false
        }
}
// Iterator still in progress, wait for either a data or an error event
select {
case log := <-it.logs:
        it.Event = new(ContractTransfer)
        if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
                it.fail = err
                return false
        }
        it.Event.Raw = log
        return true

case err := <-it.sub.Err():
        it.done = true
        it.fail = err
        return it.Next()
}
}
// Error returns any retrieval or parsing error occurred during filtering.
func (it *ContractTransferIterator) Error() error {
return it.fail
}
// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *ContractTransferIterator) Close() error {
it.sub.Unsubscribe()
return nil
}

// ContractTransfer represents a Transfer event raised by the Contract contract.
type ContractTransfer struct { 
From common.Address; 
To common.Address; 
TokenId *big.Int; 
Raw types.Log // Blockchain specific contextual infos
}

// FilterTransfer is a free log retrieval operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Contract *ContractFilterer) FilterTransfer(opts *bind.FilterOpts, from []common.Address, to []common.Address, tokenId []*big.Int) (*ContractTransferIterator, error) {

var fromRule []interface{}
for _, fromItem := range from {
        fromRule = append(fromRule, fromItem)
}
var toRule []interface{}
for _, toItem := range to {
        toRule = append(toRule, toItem)
}
var tokenIdRule []interface{}
for _, tokenIdItem := range tokenId {
        tokenIdRule = append(tokenIdRule, tokenIdItem)
}

logs, sub, err := _Contract.contract.FilterLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
if err != nil {
        return nil, err
}
return &ContractTransferIterator{contract: _Contract.contract, event: "Transfer", logs: logs, sub: sub}, nil
}

// WatchTransfer is a free log subscription operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Contract *ContractFilterer) WatchTransfer(opts *bind.WatchOpts, sink chan<- *ContractTransfer, from []common.Address, to []common.Address, tokenId []*big.Int) (event.Subscription, error) {

var fromRule []interface{}
for _, fromItem := range from {
        fromRule = append(fromRule, fromItem)
}
var toRule []interface{}
for _, toItem := range to {
        toRule = append(toRule, toItem)
}
var tokenIdRule []interface{}
for _, tokenIdItem := range tokenId {
        tokenIdRule = append(tokenIdRule, tokenIdItem)
}

logs, sub, err := _Contract.contract.WatchLogs(opts, "Transfer", fromRule, toRule, tokenIdRule)
if err != nil {
        return nil, err
}
return event.NewSubscription(func(quit <-chan struct{}) error {
        defer sub.Unsubscribe()
        for {
                select {
                case log := <-logs:
                        // New log arrived, parse the event and forward to the user
                        event := new(ContractTransfer)
                        if err := _Contract.contract.UnpackLog(event, "Transfer", log); err != nil {
                                return err
                        }
                        event.Raw = log

                        select {
                        case sink <- event:
                        case err := <-sub.Err():
                                return err
                        case <-quit:
                                return nil
                        }
                case err := <-sub.Err():
                        return err
                case <-quit:
                        return nil
                }
        }
}), nil
}

// ParseTransfer is a log parse operation binding the contract event 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (_Contract *ContractFilterer) ParseTransfer(log types.Log) (*ContractTransfer, error) {
event := new(ContractTransfer)
if err := _Contract.contract.UnpackLog(event, "Transfer", log); err != nil {
        return nil, err
}
event.Raw = log
return event, nil
}