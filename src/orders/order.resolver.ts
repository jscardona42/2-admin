import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/admin/authguard.guard';

const fetch = require('node-fetch');
import { Order, createOrderInput, updateOrderInput } from '../orders/order.entity';

const apiUrl = "http://localhost:3002";
const headers = { 'Content-Type': 'application/json' }

@Resolver(() => Order)
export class OrderResolver {
    constructor() { }

    @Query(() => [Order],)
    @UseGuards(GqlAuthGuard)
    async findAllOrders(): Promise<Order[]> {
        return fetch(`${apiUrl}/orders`).then(res => res.json())
    }

    @Mutation(() => Order)
    async createOrder(@Args("data") data: createOrderInput, @Context() ctx, err): Promise<Order> {
        return fetch(`${apiUrl}/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ data })
        }).then(res => res.json())
    }

    @Mutation(() => Order)
    async updateOrder(@Args("data") data: updateOrderInput, @Context() ctx, err): Promise<Order> {
        return fetch(`${apiUrl}/orders`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ data })
        }).then(res => res.json())
    }

    @Mutation(() => Order)
    async deleteOrder(@Args("id") id: number, @Context() ctx, err): Promise<Order> {
        return fetch(`${apiUrl}/orders`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ id })
        }).then(res => res.json())
    }

}