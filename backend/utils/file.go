package utils

import (
	"errors"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

func SaveUploadedFile(r *http.Request, fieldName, dstDir, dstName string) (string, error) {
	file, _, err := r.FormFile(fieldName)
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Check MIME Type
	buffer := make([]byte, 512)
	_, _ = file.Read(buffer)
	contentType := http.DetectContentType(buffer)
	ext, err := mime.ExtensionsByType(contentType)
	if err != nil || len(ext) == 0 {
		return "", errors.New("file type not allowed")
	}

	_, _ = file.Seek(0, io.SeekStart)
	filePath := filepath.Join(dstDir, dstName+ext[0])
	dst, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		return "", err
	}
	return ext[0], nil
}
