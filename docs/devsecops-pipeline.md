# DevSecOps Pipeline

This project implements a focused DevSecOps baseline in Jenkins for the controls that fit the current architecture: Node.js services, React frontend, Docker images, Docker Compose, Kubernetes YAML, Ansible, and an HTTP API gateway.

## Implemented Controls

| Control | Tool | Jenkins Stage | Gate |
| --- | --- | --- | --- |
| Secret scanning | Gitleaks | `Secret Scan` | Fails on any detected secret |
| SCA | Trivy filesystem scan | `SCA Filesystem Scan` | Fails on `HIGH,CRITICAL` vulnerabilities |
| SAST | Semgrep | `SAST Scan` | Fails on Semgrep `ERROR` findings |
| IaC scanning | Trivy config scan | `IaC Scan` | Fails on `HIGH,CRITICAL` misconfigurations |
| Container scanning | Trivy image scan | `Container Image Scan` | Fails on `HIGH,CRITICAL` vulnerabilities |
| DAST | OWASP ZAP baseline | `DAST Baseline Scan` | Publishes report, does not fail on warnings |

## Reports

Jenkins archives all files under:

```text
reports/security/
```

Expected report files include:

```text
gitleaks.json
trivy-fs.json
semgrep.sarif
trivy-iac.json
trivy-auth-image.json
trivy-interview-image.json
trivy-frontend-image.json
zap-baseline.html
zap-baseline.json
zap-baseline.md
```

## Jenkins Agent Requirements

The Jenkins agent must have:

```text
docker
curl
ansible-playbook
```

Scanner CLIs are run through Docker images, so Gitleaks, Trivy, Semgrep, and ZAP do not need to be installed directly on the agent.

## Jenkins Credentials

Required credential IDs:

```text
docker-hub-creds
jwt-secret
groq-api-key
```

## Policy Notes

The current policy is intentionally strict for secrets and high-risk dependency/configuration issues, while keeping DAST non-blocking initially. Once the app has fewer baseline findings, the ZAP stage can be changed to fail on warnings by removing `-I` from the `zap-baseline.py` command.
