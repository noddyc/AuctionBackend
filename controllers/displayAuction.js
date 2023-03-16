const {sequelize, db} = require("../models")
const moment = require("moment")
const {Op} = require('sequelize');
const e = require("express");

const displayAuction = async(req, res)=>{
    // console.log(req.body);
    const statues = req.body.statues;
    const ownerId = req.body.ownerId;
    console.log(statues);
    console.log(ownerId)
    try{
        // find owner id first
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
                        // {
                        //     model: db.image,
                        //     as: 'auctionId',
                        //     attributes: ['data']
                        // }
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
                        // {
                        //     model: db.image,
                        //     as: 'auctionId',
                        //     attributes: ['data']
                        // }
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
            // owner id not present
            // console.log(Array.isArray(statues));
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
                        // {
                        //     model: db.image,
                        //     as: 'auctionId',
                        //     attributes: ['data']
                        // }
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
                        // {
                        //     model: db.image,
                        //     as: 'auctionId',
                        //     attributes: ['data']
                        // }
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