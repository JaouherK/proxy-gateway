# Contributing to Proxy-gateway

:tada:  First of all, thanks for taking the time to contribute! :+1:

The following is a set of guidelines for contributing to Proxy-gateway and its packages. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a merge request.

[Local Development](#local-development)

[Merge Requests](#merge-requests)

[Maintainers list](#maintainers-list)

[Style Guides](#style-guides)
  * [Git Commit Messages](#git-commit-messages)


<a id="local-development"/>

## Local development
Proxy-gateway and all libraries can be developed locally. 

<a id="merge-requests"/>

## Merge requests
The process described here has several goals:

- Maintain Proxy-gateway's quality
- Fix problems that are important to users
- Enable a sustainable system for CT's maintainers to review contributions

Please follow these steps to help with a better readability:
- The branch name should follow the following format:
``ticketId_ticket-title`` for example : ``CX0_DEV-11145_improve-test-coverage``
- The tag for QA & production should have a description for easier readability
- follow the style guide
- Please assign one of the maintainers from the list below to the merge request

<a id="maintainers-list"/>

## Maintainers list

| Name  	| Role  	|
|:-:	|:-:	|
| Jaouher Kharrat   	| owner   	|
| Agustín Amenábar L.  	| owner   	|
| Serhii Pashkevych  	| Owner   	|

<a id="style-guides"/>

## Style guides
WIP

<a id="git-commit-messages"/>

#### Git Commit Messages
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and merge requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings



