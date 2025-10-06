import { Request, Response, Router } from "express";
import { createPriority, findAll } from "../service/PriorityService";

const endpoints = Router();