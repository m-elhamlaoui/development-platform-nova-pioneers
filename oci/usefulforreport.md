### 🚀 Connect to OCI VM

#### Direct command with private key

```bash
ssh -i ~/.ssh/ssh-key-2025-05-24.key ubuntu@141.144.226.68
# ✅ -i: Specifies the private key to use
# ✅ ubuntu: The correct user for this VM
# ✅ Replace IP if it changes in the future
```

#### Easier way without private key
modify ~./ssh/config :
```bash
Host oci-vm-np
    HostName 141.144.226.68
    User ubuntu
    IdentityFile ~/.ssh/ssh-key-2025-05-24.key
```
connect with :
```bash
ssh oci-vm-np
```
# Nova Pioneers Ansible Configuration

## Overview

This Ansible setup automates the complete installation and configuration of software required for the Nova Pioneers project on an **OCI Ubuntu VM**.

---

## Project Structure
nova-ansible/
├── inventory/
│   └── hosts.yml          # VM connection details
└── playbooks/
└── install-software.yml  # Software installation tasks

---

## Configuration Details

### `inventory/hosts.yml`

This file specifies connection parameters for the target VM:
* **Host**: `oci-vm-np` (should align with your SSH config)
* **IP**: `141.144.226.68`
* **User**: `ubuntu`
* **SSH Key**: Leverages your existing SSH key file

### `playbooks/install-software.yml`

This playbook installs the entire Nova Pioneers software stack, which includes:
* **System Updates**: Updates Ubuntu packages and installs essential utilities (like `curl`, `wget`, `git`, `htop`, `tree`).
* **Docker Installation**: Adds the official Docker repository, installs **Docker CE**, **CLI**, and **containerd**. It also starts and enables the Docker service, adds the `ubuntu` user to the `docker` group, and installs **Docker Compose**.
* **Java Development**: Installs **OpenJDK 21** (JDK + JRE), sets the `JAVA_HOME` environment variable, and installs **Maven** for building Spring Boot applications.
* **Application Setup**: Creates the `/opt/nova-pioneers` directory for application deployments.

---

## Usage

1.  **Test Connection**

    ```bash
    ansible -i inventory/hosts.yml oci-vm-np -m ping
    ```

2.  **Install All Software**

    ```bash
    ansible-playbook -i inventory/hosts.yml playbooks/install-software.yml
    ```

3.  **Verify Installation**

    ```bash
    ansible -i inventory/hosts.yml oci-vm-np -a "docker --version"
    ansible -i inventory/hosts.yml oci-vm-np -a "java -version"
    ```

---

## What Gets Installed

* ✅ **Docker CE + Docker Compose** (for containerization)
* ✅ **OpenJDK 21 + Maven** (for Spring Boot development)
* ✅ **Git** (for code management)
* ✅ **System utilities** (`htop`, `tree`, `curl`, `wget`)
* ✅ **Application directory** (`/opt/nova-pioneers`)

---

## Requirements

* **Ansible** must be installed on your local machine (e.g., WSL).
* **SSH access** to your OCI VM needs to be configured.
* **`sudo` privileges** are required on the target VM.

---

## Result

After executing the playbook, your **OCI VM** will be fully prepared to deploy the Nova Pioneers microservices stack with all dependencies correctly configured.

