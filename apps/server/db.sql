#用户表
CREATE TABLE `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `open_id` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '微信openid',
  `union_id` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '微信unionid',
  `username` varchar(255) NOT NULL DEFAULT '' COMMENT '用户名',
  `avatar_url` varchar(255) NOT NULL DEFAULT '' COMMENT '头像地址',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_open_id_union_id` (`open_id`, `union_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

#岩馆表
CREATE TABLE `gym` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '岩馆名称',
    `address` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '岩馆地址',
    `latitude` double NOT NULL DEFAULT 0 COMMENT '地点纬度',
    `longitude` double NOT NULL DEFAULT 0 COMMENT '地点经度',
    `phone` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '岩馆电话',
    `business_hour` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '营业时间',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='岩馆表';


#岩壁表
CREATE TABLE `wall` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '岩壁名称',
    `img_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '岩壁图片地址',
    `gym_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属岩馆id',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOTNULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='岩壁表';

#线路表
CREATE TABLE `route`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '线路名称',
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户id',
    `wall_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属岩壁id',
    `img_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '线路图片地址',
    `gym_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '所属岩馆id',
    `start_info` TEXT NOT NULL DEFAULT '' COMMENT '起点信息',
    `end_info` TEXT NOT NULL DEFAULT '' COMMENT '终点信息',
    `route_info` TEXT NOT NULL DEFAULT '' COMMENT '线路信息',
    `level` TINYINT NOT NULL DEFAULT 0 COMMENT '等级',
    `wall_type` TINYINT NOT NULL DEFAULT 0 COMMENT '岩壁类型',
    `offical` BOOLEAN NOT NULL DEFAULT 0 COMMENT '是否是官方线路',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOTNULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='线路表';

#线路类型表
CREATE TABLE `route_type` (
    `id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `route_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '线路id',
    `type` INT NOT NULL DEFAULT 0 COMMENT '类型',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOTNULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`),
)   ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='线路类型表';


#完攀表
CREATE TABLE `send` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户id',
    `route_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '线路id',
    `beta_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'beta id',
    `bata_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'beta url',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOTNULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='完攀表';

#beta表
CREATE TABLE `beta` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户id',
    `route_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '线路id',
    `send_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '完攀id',
    `bata_url` VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'beta url',
    `created_at`timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOTNULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='beta表';

#收藏表
CREATE TABLE `favorite` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户id',
    `favorite_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '线路id',
    `favorite_type` TINYINT NOT NULL DEFAULT 0 COMMENT '收藏类型, 0-线路, 1-岩馆',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` timestamp NOTNULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` timestamp DEFAULT NULL,
    PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';
