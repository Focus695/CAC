#!/bin/bash

echo "=== 检查可能被追踪的敏感文件 ==="

HAS_ISSUES=0

echo -e "\n1. 检查环境变量文件..."
ENV_FILES=$(git ls-files | grep -E '\.env($|\.)')
if [ -n "$ENV_FILES" ]; then
  echo "❌ 发现被追踪的.env文件:"
  echo "$ENV_FILES"
  HAS_ISSUES=1
else
  echo "✅ 未发现被追踪的.env文件"
fi

echo -e "\n2. 检查上传文件..."
UPLOAD_FILES=$(git ls-files | grep uploads/)
if [ -n "$UPLOAD_FILES" ]; then
  echo "❌ 发现被追踪的uploads文件:"
  echo "$UPLOAD_FILES"
  HAS_ISSUES=1
else
  echo "✅ 未发现被追踪的uploads文件"
fi

echo -e "\n3. 检查.claude配置..."
CLAUDE_FILES=$(git ls-files | grep .claude)
if [ -n "$CLAUDE_FILES" ]; then
  echo "❌ 发现被追踪的.claude文件:"
  echo "$CLAUDE_FILES"
  HAS_ISSUES=1
else
  echo "✅ 未发现被追踪的.claude文件"
fi

echo -e "\n4. 检查密钥文件..."
KEY_FILES=$(git ls-files | grep -E '\.(pem|key|cert|crt)$')
if [ -n "$KEY_FILES" ]; then
  echo "❌ 发现被追踪的密钥文件:"
  echo "$KEY_FILES"
  HAS_ISSUES=1
else
  echo "✅ 未发现被追踪的密钥文件"
fi

echo -e "\n5. 检查数据库文件..."
DB_FILES=$(git ls-files | grep -E '\.(sqlite|db)$')
if [ -n "$DB_FILES" ]; then
  echo "❌ 发现被追踪的数据库文件:"
  echo "$DB_FILES"
  HAS_ISSUES=1
else
  echo "✅ 未发现被追踪的数据库文件"
fi

echo -e "\n=== 检查完成 ==="

if [ $HAS_ISSUES -eq 1 ]; then
  echo -e "\n⚠️  警告：发现敏感文件被追踪！"
  echo "请使用以下命令移除追踪："
  echo "  git rm --cached <文件路径>"
  exit 1
else
  echo -e "\n✅ 所有检查通过！没有发现敏感文件被追踪。"
  exit 0
fi
