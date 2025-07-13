package main

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

type User struct {
    ID        uint   `gorm:"primaryKey"`
    Username  string `gorm:"unique;not null"`
    Password  string `gorm:"not null"`
    Token     string
    CartID    uint
    CreatedAt time.Time
}

type Item struct {
    ID        uint   `gorm:"primaryKey"`
    Name      string `gorm:"not null"`
    Status    string
    CreatedAt time.Time
}

type Cart struct {
    ID        uint   `gorm:"primaryKey"`
    UserID    uint   `gorm:"uniqueIndex"`
    Name      string
    Status    string
    CreatedAt time.Time
    CartItems []CartItem
}

type CartItem struct {
    CartID uint `gorm:"primaryKey"`
    ItemID uint `gorm:"primaryKey"`
}

type Order struct {
    ID        uint   `gorm:"primaryKey"`
    CartID    uint
    UserID    uint
    CreatedAt time.Time
}

var DB *gorm.DB

func main() {
    r := gin.Default()

    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    })

    dbInit()

    r.POST("/users", createUser)
    r.GET("/users", listUsers)
    r.POST("/users/login", userLogin)
    r.POST("/items", createItem)
    r.GET("/items", listItems)
    r.POST("/carts", authMiddleware(), addToCart)
    r.GET("/carts", authMiddleware(), listCarts)
    r.POST("/orders", authMiddleware(), createOrder)
    r.GET("/orders", authMiddleware(), listOrders)

    r.Run(":8080")
}

func dbInit() {
    var err error
    DB, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database: " + err.Error())
    }
    DB.AutoMigrate(&User{}, &Item{}, &Cart{}, &CartItem{}, &Order{})
}


func createUser(c *gin.Context) {
    var input struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    user := User{Username: input.Username, Password: input.Password, CreatedAt: time.Now()}
    DB.Create(&user)
    c.JSON(http.StatusOK, user)
}

func listUsers(c *gin.Context) {
    var users []User
    DB.Find(&users)
    c.JSON(http.StatusOK, users)
}

func userLogin(c *gin.Context) {
    var input struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var user User
    if err := DB.Where("username = ? AND password = ?", input.Username, input.Password).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username/password"})
        return
    }

    token := uuid.New().String()
    user.Token = token
    DB.Save(&user)
    c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func authMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        var user User
        if token == "" || DB.Where("token = ?", token).First(&user).Error != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }
        c.Set("user", user)
        c.Next()
    }
}

func createItem(c *gin.Context) {
    var input struct {
        Name string `json:"name"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    item := Item{Name: input.Name, CreatedAt: time.Now()}
    DB.Create(&item)
    c.JSON(http.StatusOK, item)
}

func listItems(c *gin.Context) {
    var items []Item
    DB.Find(&items)
    c.JSON(http.StatusOK, items)
}

func addToCart(c *gin.Context) {
    user := c.MustGet("user").(User)

    var input struct {
        ItemID uint `json:"item_id"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    var cart Cart
    if err := DB.Where("user_id = ?", user.ID).First(&cart).Error; err != nil {
        cart = Cart{UserID: user.ID, CreatedAt: time.Now()}
        DB.Create(&cart)
    }

    cartItem := CartItem{CartID: cart.ID, ItemID: input.ItemID}
    DB.Create(&cartItem)
    c.JSON(http.StatusOK, gin.H{"cart_id": cart.ID, "item_id": input.ItemID})
}

func listCarts(c *gin.Context) {
    var carts []Cart
    DB.Preload("CartItems").Find(&carts)
    c.JSON(http.StatusOK, carts)
}

func createOrder(c *gin.Context) {
    user := c.MustGet("user").(User)

    var input struct {
        CartID uint `json:"cart_id"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    order := Order{CartID: input.CartID, UserID: user.ID, CreatedAt: time.Now()}
    DB.Create(&order)
    c.JSON(http.StatusOK, order)
}

func listOrders(c *gin.Context) {
    user := c.MustGet("user").(User)

    var orders []Order
    DB.Where("user_id = ?", user.ID).Find(&orders)
    c.JSON(http.StatusOK, orders)
}
