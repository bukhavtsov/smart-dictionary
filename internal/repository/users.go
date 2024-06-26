package repository

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository struct {
	conn *pgx.Conn
}

func NewUserRepository(conn *pgx.Conn) *UserRepository {
	return &UserRepository{conn: conn}
}

func (ur *UserRepository) GetUser(userName string, password string) error {
	var dbPassword string
	err := ur.conn.QueryRow(context.Background(), "SELECT password FROM users WHERE user_name = $1", userName).Scan(&dbPassword)
	if err != nil {
		return err
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(password))
	if err != nil {
		return fmt.Errorf("authentication failed: %w", err)
	}

	return nil
}
