/*
    database quries of displaying games
 */

const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");

/*
    this is the database query of displaying game information
*/
const displayAuction = async(req, res)=>{
    const statues = req.body.statues;
    const ownerId = req.body.ownerId;
    console.log(statues);
    console.log(ownerId)
    try{
        if(ownerId){
            if(Array.isArray(statues)){
                const result = await db.auction.findAll({
                    include:[
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        },
                        {
                            model: db.product,
                            through: db.product_auction
                        }
                      ]
                    ,
                    where:{
                        [Op.and]:{
                            status:{
                                [Op.in]: statues
                            },
                            ownerId:{
                                [Op.eq]: ownerId
                            }
                        }
                    }
                })
                res.status(200).json(result)
            }else{
                const result = await db.auction.findAll({
                    include:[
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        },
                        {
                            model: db.product,
                            through: db.product_auction
                        }
                      ]
                    ,
                    where:{
                        [Op.and]:{
                            status:{
                                [Op.eq]: statues
                            },
                            ownerId:{
                                [Op.eq]: ownerId
                            }
                        }
                    }
                })
                res.status(200).json(result)
            }
        }else{

            if(Array.isArray(statues)){
                const result = await db.auction.findAll({
                    include: [

                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                                model: db.user,
                                as: 'player_1',
                                attributes: ['firstname', 'lastname', 'username'],
                            },
                            {
                                model: db.user,
                                as: 'player_2',
                                attributes: ['firstname', 'lastname', 'username'],
                            }
                      ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        },
                        {
                            model: db.product,
                            through: db.product_auction
                        }
                      ]
                    ,
                    where:{
                        status: {[Op.in]: statues}
                    }
                })
                res.status(200).json(result)
            }else{
                const result = await db.auction.findAll({
                    include: [
                        {
                            model: db.slot,
                            as: 'slot0',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                    },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                            ]
                          },
                        {
                          model: db.slot,
                          as: 'slot1',
                          include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                          model: db.slot,
                          as: 'slot2',
                          include:[
                            {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                            }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot3',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot4',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot5',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot6',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot7',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.slot,
                            as: 'slot8',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                          },
                        {
                            model: db.slot,
                            as: 'slot9',
                            include:[
                                {
                                    model: db.user,
                                    as: 'player_1',
                                    attributes: ['firstname', 'lastname', 'username'],
                                },
                                {
                                    model: db.user,
                                    as: 'player_2',
                                    attributes: ['firstname', 'lastname', 'username'],
                                }
                          ]
                        },
                        {
                            model: db.user,
                            attributes: ['firstname', 'lastname', 'username']
                        },
                        {
                            model: db.product,
                            through: db.product_auction
                        }
                      ]
                    ,
                    where:{
                        status: {[Op.eq]: statues}
                    }
                })
                res.status(200).json(result)
            }
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

module.exports = {displayAuction}