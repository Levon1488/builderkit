import { Component } from "../common/types";

export type IdentityProps = {
    address: string;
    abbreviate?: boolean;
}

export type DomainProps = {
    address?: string;
    showAddressIfNotAvailable?: boolean;
} & Component;