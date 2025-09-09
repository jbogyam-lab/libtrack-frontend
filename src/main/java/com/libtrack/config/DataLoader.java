package com.libtrack.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.libtrack.entity.Role;
import com.libtrack.entity.User;
import com.libtrack.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		String globalAdminEmail = "globalAdmin@gmail.com";
		
		if (!userRepository.findByEmail(globalAdminEmail).isPresent()) {
            User globalAdmin = new User();
            globalAdmin.setName("GlobalAdmin");
            globalAdmin.setEmail(globalAdminEmail);
//            globalAdmin.setPhone("9999999999");
            globalAdmin.setPassword(passwordEncoder.encode("admin123")); // change for security
            globalAdmin.setRole(Role.GLOBAL_ADMIN);

            // Optional default values
//            globalAdmin.setVerified(true);
//            globalAdmin.setAge(0);
//            globalAdmin.setGender("Other");

            userRepository.save(globalAdmin);
            System.out.println("Global Admin user created.");
        } else {
            System.out.println("Global Admin already exists.");
        }
		
		String librarianEmail = "librarian@gmail.com";
		
		if (!userRepository.findByEmail(librarianEmail).isPresent()) {
            User librarian = new User();
            librarian.setName("Librarian");
            librarian.setEmail(librarianEmail);
//            globalAdmin.setPhone("9999999999");
            librarian.setPassword(passwordEncoder.encode("librarian123")); // change for security
            librarian.setRole(Role.LIBRARIAN);

            // Optional default values
//            globalAdmin.setVerified(true);
//            globalAdmin.setAge(0);
//            globalAdmin.setGender("Other");

            userRepository.save(librarian);
            System.out.println("Librarian user created.");
        } else {
            System.out.println("Librarian already exists.");
        }
		
		
		
	}
	
	
}