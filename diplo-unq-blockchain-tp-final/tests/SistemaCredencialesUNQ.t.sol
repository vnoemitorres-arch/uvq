// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SistemaCredencialesUNQ} from "../contracts/SistemaCredencialesUNQ.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract SistemaCredencialesUNQTest is Test {
    SistemaCredencialesUNQ sistema;
    address decano;
    address alumno;

    bytes32 studentHash = keccak256(abi.encodePacked("Juan Perez", "12345678"));
    bytes32 docHash = keccak256(abi.encodePacked("PDF_TITULO"));

    function setUp() public {
        decano = makeAddr("decano");
        alumno = makeAddr("alumno");
        sistema = new SistemaCredencialesUNQ(address(this));
    }

    function test_AdminAgregaIssuer() public {
        sistema.grantIssuer(decano);
        assertTrue(sistema.hasRole(sistema.ISSUER_ROLE(), decano));
    }

    function test_IssuerEmiteCredencial() public {
        uint256 id = sistema.issueCredential(alumno, "Licenciatura", studentHash, docHash, "ipfs://uri");

        (SistemaCredencialesUNQ.Credential memory cred, bool isValid) = sistema.verify(id);
        assertTrue(isValid);
        assertEq(cred.degreeName, "Licenciatura");
    }

    function test_IssuerRevocaCredencial() public {
        uint256 id = sistema.issueCredential(alumno, "Licenciatura", studentHash, docHash, "ipfs://uri");

        sistema.revoke(id, "Error administrativo");

        (, bool isValid) = sistema.verify(id);
        assertFalse(isValid);
    }

    function test_AdminRevocaIssuer() public {
        sistema.grantIssuer(decano);
        assertTrue(sistema.hasRole(sistema.ISSUER_ROLE(), decano));

        sistema.revokeIssuer(decano);
        assertFalse(sistema.hasRole(sistema.ISSUER_ROLE(), decano));
    }

    function test_SupportsInterface() public view {
        assertTrue(sistema.supportsInterface(type(IERC165).interfaceId));
        assertTrue(sistema.supportsInterface(type(IERC721).interfaceId));
        assertTrue(sistema.supportsInterface(type(IAccessControl).interfaceId));
        assertFalse(sistema.supportsInterface(bytes4(0xdeadbeef)));
    }

    function test_FallarRevocacionCredencialInexistente() public {
        vm.expectRevert("Credencial inexistente");
        sistema.revoke(999, "No existe");
    }

    function test_FallarEmisionSinRol() public {
        sistema.revokeRole(sistema.ISSUER_ROLE(), address(this));

        vm.expectRevert();
        sistema.issueCredential(alumno, "Falla", studentHash, docHash, "uri");

        sistema.grantRole(sistema.ISSUER_ROLE(), address(this));
    }

    function test_FallarTransferenciaSoulbound() public {
        uint256 id = sistema.issueCredential(alumno, "Soulbound Test", studentHash, docHash, "uri");

        vm.prank(alumno);
        vm.expectRevert("Soulbound: Las credenciales son intransferibles");
        sistema.transferFrom(alumno, decano, id);
    }

    function testFuzz_issueCredential(address randomStudent) public {
        vm.assume(randomStudent != address(0));
        vm.assume(randomStudent.code.length == 0);

        uint256 id = sistema.issueCredential(randomStudent, "Fuzz", studentHash, docHash, "uri");
        assertEq(sistema.ownerOf(id), randomStudent);
    }
}
