# The Vagrantfile is only used to easily spin up a simple ubuntu development box with docker installed

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.box_check_update = true
  config.vm.network "private_network", ip: "192.168.33.10"

  config.vm.provision "shell", inline: <<-SHELL
     sudo apt-get update
     sudo apt-get install -y curl
     curl -sSL https://get.docker.com/ | sh
  SHELL
end
