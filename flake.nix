{
  description = "Next.js Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20       # Node.js LTS version
            yarn            # Include yarn (remove if using npm only)
            git             # Optional, convenient for dev
          ];

          shellHook = ''
            echo "🌿 Entering Next.js development shell."
            node --version
            yarn --version
          '';
        };
      }
    );
}
